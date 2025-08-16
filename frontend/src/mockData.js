// Mock data for PariFlix - Netflix clone
export const mockMovies = [
  {
    id: 1,
    title: "Stranger Things",
    backdrop_path: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    poster_path: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
    release_date: "2016-07-15",
    vote_average: 8.7,
    genre_ids: [18, 9648, 878],
    video_key: "b9EkMc79ZSU",
    adult: false,
    runtime: 51,
    first_air_date: "2016-07-15"
  },
  {
    id: 2,
    title: "The Witcher",
    backdrop_path: "https://image.tmdb.org/t/p/original/7prYzufdIOy1KAkZKkfqNx8Gd61.jpg",
    poster_path: "https://image.tmdb.org/t/p/w500/cZ0d3rtvXPVvuiX22sP79K3Hmjz.jpg",
    overview: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.",
    release_date: "2019-12-20",
    vote_average: 8.2,
    genre_ids: [18, 10759, 10765],
    video_key: "ndl1W4ltcmg",
    adult: false,
    runtime: 60,
    first_air_date: "2019-12-20"
  },
  {
    id: 3,
    title: "Wednesday",
    backdrop_path: "https://image.tmdb.org/t/p/original/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg",
    poster_path: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    overview: "A sleuthing, supernaturally infused mystery charting Wednesday Addams' years as a student at Nevermore Academy.",
    release_date: "2022-11-23",
    vote_average: 8.5,
    genre_ids: [35, 80, 9648],
    video_key: "Di310WS8zLk",
    adult: false,
    runtime: 45,
    first_air_date: "2022-11-23"
  },
  {
    id: 4,
    title: "Money Heist",
    backdrop_path: "https://image.tmdb.org/t/p/original/Aa9TLpNpBMyRkD8sPJ7ACKLjt8l.jpg",
    poster_path: "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    overview: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
    release_date: "2017-05-02",
    vote_average: 8.3,
    genre_ids: [80, 18],
    video_key: "htqXL94Rza4",
    adult: false,
    runtime: 70,
    first_air_date: "2017-05-02"
  },
  {
    id: 5,
    title: "The Crown",
    backdrop_path: "https://image.tmdb.org/t/p/original/wHa6KOJAoNTFLFtp7wguUJKSnju.jpg",
    poster_path: "https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg",
    overview: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    release_date: "2016-11-04",
    vote_average: 8.7,
    genre_ids: [18, 36],
    video_key: "JWtnJjn6ng0",
    adult: false,
    runtime: 58,
    first_air_date: "2016-11-04"
  }
];

export const mockMovieCategories = {
  trending: [
    {
      id: 101,
      title: "Avatar: The Way of Water",
      backdrop_path: "https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
      poster_path: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      overview: "Set more than a decade after the events of the first film, Avatar: The Way of Water begins to tell the story of the Sully family.",
      release_date: "2022-12-14",
      vote_average: 7.6,
      video_key: "d9MyW72ELq0",
      runtime: 192
    },
    {
      id: 102,
      title: "Top Gun: Maverick",
      backdrop_path: "https://image.tmdb.org/t/p/original/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg",
      poster_path: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
      overview: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past.",
      release_date: "2022-05-24",
      vote_average: 8.3,
      video_key: "giXco2jaZ_4",
      runtime: 130
    }
  ],
  action: [
    {
      id: 201,
      title: "John Wick: Chapter 4",
      backdrop_path: "https://image.tmdb.org/t/p/original/h736LpI3QJzrHwaw8yHKkCv1J7g.jpg",
      poster_path: "https://image.tmdb.org/t/p/w500/vZloFAK5jq9I8wCB1L7b6CPq4Qm.jpg",
      overview: "With the price on his head ever increasing, John Wick uncovers a path to defeating The High Table.",
      release_date: "2023-03-22",
      vote_average: 7.8,
      video_key: "qEVUtrk8_B4",
      runtime: 169
    },
    {
      id: 202,
      title: "Fast X",
      backdrop_path: "https://image.tmdb.org/t/p/original/4XM8DUTQb3lhLemJC51Jx4a2EuA.jpg",
      poster_path: "https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg",
      overview: "Over many missions and against impossible odds, Dom Toretto and his family have outsmarted, out-nerved and outdriven every foe in their path.",
      release_date: "2023-05-17",
      vote_average: 7.1,
      video_key: "aOb15GVFZxU",
      runtime: 141
    }
  ],
  comedy: [
    {
      id: 301,
      title: "The Super Mario Bros. Movie",
      backdrop_path: "https://image.tmdb.org/t/p/original/nLBRD7UPR6GjmWQp6ASAfCTaWKX.jpg",
      poster_path: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mTRXv9JnM.jpg",
      overview: "While working underground to fix a water main, Brooklyn plumbers—and brothers—Mario and Luigi are transported down a mysterious pipe.",
      release_date: "2023-04-05",
      vote_average: 7.8,
      video_key: "TnGl01FkMMo",
      runtime: 92
    }
  ]
};

export const mockUser = {
  id: 1,
  name: "Usuario Demo",
  email: "demo@pariflix.com",
  avatar: "https://i.pravatar.cc/150?img=3",
  subscription: {
    type: "free_trial",
    startDate: "2024-01-15",
    endDate: "2024-02-14",
    daysRemaining: 10
  },
  watchHistory: [
    { movieId: 1, watchedAt: "2024-01-20", progress: 85 },
    { movieId: 2, watchedAt: "2024-01-18", progress: 45 }
  ],
  myList: [1, 3, 5]
};