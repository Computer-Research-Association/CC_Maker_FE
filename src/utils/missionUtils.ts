export const getIconName = (score: number) => {
  switch (score) {
    case 1:
      return "star-outline";
    case 3:
      return "heart-outline";
    case 5:
      return "diamond-outline";
    case 10:
      return "trophy-outline";
    default:
      return "star-outline";
  }
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
};
