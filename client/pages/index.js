// import buildClient from "../api/build-client";
import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );

  // return currentUser ? <h1>You are signed in</h1> : <h1>NOT</h1>;
  // return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  // const response = await buildClient(context).get("/api/users/currentuser");
  // return response.data;
  const response = await client.get("/api/tickets");
  const data = response.data;
  return { currentUser, tickets: data };
};

export default LandingPage;
