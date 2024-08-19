const POSITION_GAP = 65535; // TODO: move to config

const TRELLO_COLORS = {
  "pink_light": "#FFC0CB",
  "pink": "#FF69B4",
  "pink_dark": "#C71585",
  "yellow_light": "#FFFFE0",
  "yellow": "#FFFF00",
  "yellow_dark": "#FFD700",
  "lime_light": "#DFFF00",
  "lime": "#00FF00",
  "lime_dark": "#32CD32",
  "blue_light": "#ADD8E6",
  "blue": "#0000FF",
  "blue_dark": "#00008B",
  "black_light": "#A9A9A9",  // Light gray as a "light" black
  "black": "#000000",
  "black_dark": "#0A0A0A",  // A slightly darker black
  "orange_light": "#FFDAB9",
  "orange": "#FFA500",
  "orange_dark": "#FF8C00",
  "red_light": "#FF7F7F",
  "red": "#FF0000",
  "red_dark": "#8B0000",
  "purple_light": "#E6E6FA",
  "purple": "#800080",
  "purple_dark": "#4B0082",
  "sky_light": "#87CEFA",
  "sky": "#00BFFF",
  "sky_dark": "#4682B4",
  "green_light": "#90EE90",
  "green": "#008000",
  "green_dark": "#006400",
}


module.exports = {
  inputs: {
    board: {
      type: 'ref',
      required: true,
    },
    trelloBoard: {
      type: 'json',
      required: true,
    },
    actorUser: {
      type: 'ref',
      required: true,
    },
  },

  async fn(inputs) {
    const trelloToPlankaLabels = {};

    const getTrelloLists = () => inputs.trelloBoard.lists.filter((list) => !list.closed);

    const getUsedTrelloLabels = () => {
      const result = {};
      inputs.trelloBoard.cards
        .map((card) => card.labels)
        .flat()
        .forEach((label) => {
          result[label.id] = label;
        });

      return Object.values(result);
    };

    const getTrelloCardsOfList = (listId) =>
      inputs.trelloBoard.cards.filter((card) => card.idList === listId && !card.closed);

    const getAllTrelloCheckItemsOfCard = (cardId) =>
      inputs.trelloBoard.checklists
        .filter((checklist) => checklist.idCard === cardId)
        .map((checklist) => checklist.checkItems)
        .flat();

    const getTrelloCommentsOfCard = (cardId) =>
      inputs.trelloBoard.actions.filter(
        (action) =>
          action.type === 'commentCard' &&
          action.data &&
          action.data.card &&
          action.data.card.id === cardId,
      );

    const getPlankaLabelColor = (trelloLabelColor) => TRELLO_COLORS[trelloLabelColor] || TRELLO_COLORS['black'];

    const importCardLabels = async (plankaCard, trelloCard) => {
      return Promise.all(
        trelloCard.labels.map(async (trelloLabel) => {
          return CardLabel.create({
            cardId: plankaCard.id,
            labelId: trelloToPlankaLabels[trelloLabel.id].id,
          });
        }),
      );
    };

    const importTasks = async (plankaCard, trelloCard) => {
      // TODO find workaround for tasks/checklist mismapping, see issue trello2planka#5
      return Promise.all(
        getAllTrelloCheckItemsOfCard(trelloCard.id).map(async (trelloCheckItem) => {
          return Task.create({
            cardId: plankaCard.id,
            position: trelloCheckItem.pos,
            name: trelloCheckItem.name,
            isCompleted: trelloCheckItem.state === 'complete',
          }).fetch();
        }),
      );
    };

    const importComments = async (plankaCard, trelloCard) => {
      const trelloComments = getTrelloCommentsOfCard(trelloCard.id);
      trelloComments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return Promise.all(
        trelloComments.map(async (trelloComment) => {
          return Action.create({
            cardId: plankaCard.id,
            userId: inputs.actorUser.id,
            type: 'commentCard',
            data: {
              text:
                `${trelloComment.data.text}\n\n---\n*Note: imported comment, originally posted by ` +
                `\n${trelloComment.memberCreator.fullName} (${trelloComment.memberCreator.username}) on ${trelloComment.date}*`,
            },
          }).fetch();
        }),
      );
    };

    const importCards = async (plankaList, trelloList) => {
      return Promise.all(
        getTrelloCardsOfList(trelloList.id).map(async (trelloCard) => {
          const plankaCard = await Card.create({
            boardId: inputs.board.id,
            listId: plankaList.id,
            creatorUserId: inputs.actorUser.id,
            position: trelloCard.pos,
            name: trelloCard.name,
            description: trelloCard.desc || null,
            dueDate: trelloCard.due,
          }).fetch();

          await importCardLabels(plankaCard, trelloCard);
          await importTasks(plankaCard, trelloCard);
          await importComments(plankaCard, trelloCard);

          return plankaCard;
        }),
      );
    };

    const importLabels = async () => {
      return Promise.all(
        getUsedTrelloLabels().map(async (trelloLabel, index) => {
          const plankaLabel = await Label.create({
            boardId: inputs.board.id,
            position: POSITION_GAP * (index + 1),
            name: trelloLabel.name || null,
            color: getPlankaLabelColor(trelloLabel.color),
          }).fetch();

          trelloToPlankaLabels[trelloLabel.id] = plankaLabel;
        }),
      );
    };

    const importLists = async () => {
      return Promise.all(
        getTrelloLists().map(async (trelloList) => {
          const plankaList = await List.create({
            boardId: inputs.board.id,
            name: trelloList.name,
            position: trelloList.pos,
          }).fetch();

          return importCards(plankaList, trelloList);
        }),
      );
    };

    await importLabels();
    await importLists();
  },
};
