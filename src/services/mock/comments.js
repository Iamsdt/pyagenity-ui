import { http, HttpResponse } from "msw"

const commentMock = http.get(
  /https:\/\/jsonplaceholder\.typicode\.com\/comments\/?$/,
  () => {
    // return HttpResponse.json(
    //   { message: "Something went wrong" },
    //   {
    //     status: 500,
    //   }
    // )

    // ...and respond to them using this JSON response.
    return HttpResponse.json([
      {
        id: 1,
        email: "someone@some.com",
        body: "This is a comment body",
        name: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        date: "2025-06-01T10:00:00Z",
        likes: 12,
      },
      {
        id: 2,
        email: "jane@doe.com",
        body: "Amazing post! Thanks for sharing.",
        name: "Jane Doe",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        date: "2025-06-02T12:30:00Z",
        likes: 34,
      },
      {
        id: 3,
        email: "bob@builder.com",
        body: "I found this very helpful.",
        name: "Bob Builder",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        date: "2025-06-03T09:15:00Z",
        likes: 8,
      },
      {
        id: 4,
        email: "alice@wonder.com",
        body: "Could you elaborate more on this topic?",
        name: "Alice Wonderland",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        date: "2025-06-04T14:45:00Z",
        likes: 21,
      },
      {
        id: 5,
        email: "charlie@choco.com",
        body: "Great insights, learned a lot!",
        name: "Charlie Chocolate",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
        date: "2025-06-05T16:20:00Z",
        likes: 17,
      },
    ])
  }
)

const handlers = [commentMock]

export default handlers
