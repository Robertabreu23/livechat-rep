import useChatStore from "../store/useChatStore";

function TypingIndicator() {
  const typingUsers = useChatStore((s) => s.typingUsers);

  if (typingUsers.length === 0) return null;

  const text =
    typingUsers.length === 1
      ? `${typingUsers[0]} está escribiendo...`
      : `${typingUsers.join(", ")} están escribiendo...`;

  return <p className="typing-indicator">{text}</p>;
}

export default TypingIndicator;
