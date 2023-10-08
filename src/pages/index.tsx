import ChatLayout from "@/components/Layout/ChatLayout";
import HomeCard from "@/components/Home/HomeCard";

function Home() {
  return (
    <div className="hidden lg:flex items-center justify-center flex-1">
      <HomeCard />
    </div>
  );
}

Home.getLayout = (page: React.ReactNode) => ChatLayout(page, true);

export default Home;
