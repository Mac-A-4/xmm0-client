# xmm0-client
Frontend for anonymous non-persistent chat application.
Built to interface with xmm0-server, to form a full stack application.

## Designed for anonymous/open communication:
- No account registration.
- end-to-end encryption possible, if implemented in clientside.
- Nothing recorded by server.
  - Chat and room history stored in memory, never on disk.
  - All history disposed of once room expires.
  - Client history disposed of once client disconnects/expires.

## Running
To deploy and run this app, clone the repository, modify the hostname inside of ```XMM0Api.js``` to the hostname of the server on which you are hosting the backend, xmm0-server.
Then, simply ```npm start``` and try it out!

## GUI
![Image of GUI](https://image.prntscr.com/image/tKcVtqkcStmpQ1b2APhGdA.png)
