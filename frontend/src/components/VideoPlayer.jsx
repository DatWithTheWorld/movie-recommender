import ReactPlayer from 'react-player';

function VideoPlayer({ url }) {
  return (
    <div className="w-full">
      <ReactPlayer url={url} width="100%" height="400px" controls />
    </div>
  );
}

export default VideoPlayer;