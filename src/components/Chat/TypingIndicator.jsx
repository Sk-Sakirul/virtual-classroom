const TypingIndicator = ({ users = [] }) => {
  if (!users || users.length === 0) return null;

  const getTypingText = () => {
    if (users.length === 1) {
      return `${users[0].userName} is typing...`;
    } else if (users.length === 2) {
      return `${users[0].userName} and ${users[1].userName} are typing...`;
    } else {
      return `${users[0].userName} and ${users.length - 1} others are typing...`;
    }
  };

  return (
    <div className="flex items-center space-x-2 text-gray-500 animate-pulse-soft">
      <div className="flex space-x-1">
        {users.slice(0, 3).map((user, index) => (
          <div 
            key={user.userId || index}
            className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center"
          >
            <span className="text-xs font-medium text-gray-600">
              {user.userName?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
        ))}
      </div>
      
      <div className="flex items-center space-x-1">
        <span className="text-sm">{getTypingText()}</span>
        <div className="flex space-x-1">
          <div 
            className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div 
            className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          ></div>
          <div 
            className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;