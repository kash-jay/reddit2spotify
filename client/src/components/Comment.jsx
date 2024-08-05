const Comment = ({ comment, level }) => {
  return (
    <div>
      <li
        key={comment.id}
        style={{ marginLeft: level * 20 }}
        className="list-disc"
      >
        <span className="text-wrap">{comment.body}</span>
      </li>
      <br />
    </div>
  );
};

export default Comment;
