// format date from API-req to more user friendly format
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

// find user info - username, avatar (add more?)
export const getUserInfoById = (userId, userList, defaultAvatar) => {
  const user = userList.find((user) => String(user.userId) === String(userId));
  if (user) {
    return {
      username: user.username,
      avatar: user.avatar || defaultAvatar,
    };
  }
  return null;
};

// get user info for participants - exclude user
export const getParticipantsInfo = (
  conversation,
  currentUserId,
  userList,
  DefaultAvatar
) => {
  const otherUserIds = conversation
    .map((msg) => msg.userId)
    .filter((id) => id !== currentUserId);

  const participants = userList.filter((u) => otherUserIds.includes(u.userId));

  const participantsUsername = participants.map((p) => p.username).join(", ");

  const participantsAvatar = participants.map((p) => p.avatar || DefaultAvatar);

  return { participants, participantsUsername, participantsAvatar };
};
