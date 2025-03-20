import { useParams } from "react-router-dom";

import { Cards } from "../../components/Cards/Cards";
import { Header } from "../../components/Header/Header";

export function GamePage() {
  const { pairsCount } = useParams();

  return (
    <>
      <Header />
      <Cards pairsCount={parseInt(pairsCount, 10)} previewSeconds={5}></Cards>
    </>
  );
}
