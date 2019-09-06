let db = {
    //basic user info
    users: [
        {
            userId: 'dho2323kdjfs8322lkjd',
            email: 'user@gmail.com',
            username: 'bob',
            createdAt: '2019-09-04T11:46:01.018Z',
            imageUrl: 'image/dajfepoiajwe/akdjfoe',
            bio: 'Hello whats up everybody',
            website: 'https://user.com',
            location: 'San Jose, CA'
        }
    ],
    //post info
    posts: [
        {
            username: 'user',
            body: 'post body here',
            createdAt: '2019-09-23T11:46:01.018Z',
            likeCount: 10,
            commentCount: 3

        }
    ],
    comments: [
        {
            username: 'user',
            postId: 10,
            body: 'comment body',
            createdAt: '2019-09-23T11:46:01.018Z'
        }
    ]
};

const userDetails = {
    //Redux data -- what user info we'll hold in Redux front app application
    creds: {
        userID: "dho2323kdjfs8322lkjd",
        email: "user@email.com",
        username: "user",
        createdAt: "",
        imageUrl: "",
        bio: "hello",
        website: "https://user.com",
        location: "SF, CA"
    },
    //if user liked a certain post
    likes: [
        {
            username: 'user',
            postId: "aljkdskfjeioDADDF"
        },
        {
            username: 'user2',
            postID: "akjfioaejDDAFE"
        }
    ]
};