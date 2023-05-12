import { Link } from "react-router-dom";

export function Error() {
  return (
    <p>
      Something bad happened. <Link to="/">Back to home</Link>
    </p>
  );
}
