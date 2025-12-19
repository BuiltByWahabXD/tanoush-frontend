import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

export default function MasonryImageList() {
  return (
    <Box sx={{ width: '70%', height: 'auto', overflow: 'hidden', maxWidth: '100%' }}>
      <ImageList variant="masonry" cols={3} gap={15} sx={{ overflow: 'hidden' }}>
        {itemData.map((item) => (
          <ImageListItem 
            key={item.img}
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.3s ease-in-out',
              overflow: 'hidden',
              '&:hover': {
                transform: 'scale(1.03)',
                zIndex: 10,
              },
              '&:hover img': {
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              }
            }}
          >
            <img
              srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.img}?w=248&fit=crop&auto=format`}
              alt={item.title}
              loading="lazy"
              style={{
                borderRadius: '8px',
                transition: 'box-shadow 0.3s ease-in-out',
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}

const itemData = [
  {
    img: '/static/images/imagelist/RedLion.jpg',
    title: 'Red Lion',
  },
  {
    img: '/static/images/imagelist/callofduty.jpg',
    title: 'Call of Duty',
  },
  {
    img: '/static/images/imagelist/ghost.jpg',
    title: 'Ghost',
  },
  {
    img: '/static/images/imagelist/lastOfUs.jpg',
    title: 'The Last of Us',
  },
  {
    img: '/static/images/imagelist/RDR2.jpg',
    title: 'Red Dead Redemption 2',
  },
  {
    img: '/static/images/imagelist/farCry.jpg',
    title: 'Far Cry 5',
  },
  {
    img: '/static/images/imagelist/fortnite.jpg',
    title: 'Fortnite',
  },
  {
    img: '/static/images/imagelist/witcher.jpg',
    title: 'Witcher 3',
  },
  {
    img: '/static/images/imagelist/spiderman.jpg',
    title: 'Spiderman',
  },
  {
    img: '/static/images/imagelist/AC3.jpg',
    title: "Assassin's Creed 3",
  },
  
];
