import DefaultLayout from "../interface/DefaultLayout";

function Home() {
  return (
    <DefaultLayout
      metadata={{
        title: "Home",
        description: "Welcome to Kawassaki",
      }}
    >
      <h1>Lorayne, se você me ama, de uma risadinha! 🏀</h1>
    </DefaultLayout>
  );
}

export default Home;
