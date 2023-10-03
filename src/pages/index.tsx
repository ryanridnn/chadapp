import ChatLayout from "@/components/Layout/ChatLayout";
import HomeCard from "@/components/Home/HomeCard";

function Home() {
  return (
    <div className="flex items-center justify-center flex-1">
      <HomeCard />
    </div>
  );
}

Home.getLayout = ChatLayout;

export default Home;
