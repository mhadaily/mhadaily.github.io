type TalkType = 'conference' | 'meetup' | 'podcast' | 'workshop';

interface Talk {
  wordpress_id: number;
  date: string;
  featured_media: {
    localFile: {
      publicURL: string;
    };
  };
  title: string;
  acf: {
    title: string;
    description: string;
    type: TalkType;
    slide: string;
    website: string;
    date: string;
    video: string;
    online: boolean;
    gallery: number[];
  };
}

interface AllWordpressWpConferences {
  totalCount: number;
  edges: { node: Talk }[];
}

export default AllWordpressWpConferences;
