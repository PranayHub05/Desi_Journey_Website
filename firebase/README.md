# Firebase data blueprint

Configure Firebase in `client/.env`, then use the SDK initialization stub in `client/src/services/firebase.js`.

## Collections

| Collection | Purpose | Key fields |
| --- | --- | --- |
| `users` | Authenticated customer profiles | `displayName`, `email`, `phone`, `createdAt` |
| `tours` | Published travel itineraries | `title`, `location`, `price`, `duration`, `description`, `images`, `featured`, `rating`, `createdAt` |
| `blogs` | Journal posts | `title`, `slug`, `excerpt`, `image`, `content`, `publishedAt` |
| `gallery` | Curated travel photography | `image`, `alt`, `location`, `createdAt` |
| `reviews` | Approved traveller reviews | `author`, `rating`, `quote`, `approved`, `createdAt` |
| `bookings` | Customer enquiries and bookings | `userId`, `tourId`, `status`, `travellers`, `createdAt` |
| `contact` | Contact form submissions | `name`, `email`, `phone`, `message`, `createdAt` |

Store tour, gallery, and blog image files in Firebase Storage under `tours/`, `gallery/`, and `blogs/`, and write their download URLs to their respective Firestore documents.
