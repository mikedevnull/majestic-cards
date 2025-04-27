import { Form, useSearchParams } from "react-router";
import { LyrionItemSelector } from "~/components/lyrionItemSelector";

export default function AddNewCard() {
  const [searchParams] = useSearchParams();
  const newCardId = searchParams.get("id");
  if (!newCardId) {
    throw new Response("No card id provided", { status: 400 });
  }

  return (
    <>
      <h1>Add a new card</h1>
      <Form method="post">
        <label htmlFor="cardId">Card Id</label>
        <input
          type="text"
          id="cardId"
          name="cardTitlecardId"
          disabled={true}
          value={newCardId}
        />
        <span className="label">Lyrion Target Item</span>
        <div className="actionSelectorContainer">
          <LyrionItemSelector />
        </div>
        <button type="submit">Add</button>
      </Form>
    </>
  );
}
