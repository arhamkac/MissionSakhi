import Post from "../Components/Post";

function Anonymous_Forum() {
  return (
    <div>
      <main className="bg-[url(/low-poly-grid-haikei.svg)] bg-cover bg-no-repeat bg-center min-h-screen p-6">
        <h1 className="text-4xl font-bold text-white drop-shadow-xl text-center p-6">
          Anonymous Forum
        </h1>
        <Post />
      </main>
    </div>
  );
}

export default Anonymous_Forum;
