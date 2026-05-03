import { Form, redirect } from "react-router";
import type { Route } from "./+types/edit-card";
import prisma from "../lib/prisma";
import { z } from 'zod'

export async function loader({ params }: Route.LoaderArgs) {
    const cardId = parseInt(params.cardId);
    const card = await prisma.playbackItem.findUnique({ where: { id: cardId } })
    if (!card) {
        throw new Response("Not Found", { status: 404 });
    }
    return { card }
};

const UpdateCardSchema = z.object({
    id: z.coerce.number(),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    backendUrl: z.string().optional()
}).strict()

export async function action({
    request,
}: Route.ActionArgs) {
    const formData = await request.formData().then((form) => Object.fromEntries(form));
    const updateData = UpdateCardSchema.parse(formData);
    await prisma.playbackItem.update({ where: { id: updateData.id }, data: updateData })

    return redirect('/')
}

export default function CardEditor({ loaderData }: Route.ComponentProps) {
    const { card } = loaderData;
    return <main className="max-w-4xl mx-auto flex-1 w-full">
        <div className="card w-96 mx-auto bg-base-100 card-md shadow-sm">
            <figure className="h-64">
                <img
                    src={card.imageUrl ?? ""}
                    alt="" />
            </figure>
            <div className="card-body">
                <Form method="post" className="flex flex-col gap-4">
                    <label className="input">
                        <span className="label">Title</span>
                        <input type="text" name="title" defaultValue={card.title} />
                    </label>

                    <label className="input">
                        <span className="label">Subtitle</span>
                        <input type="text" name="subtitle" defaultValue={card.subtitle ?? ""} />
                    </label>

                    <label className="input">
                        <span className="label">Target</span>
                        <input type="text" name="target" value={card.backendUrl ?? ""} disabled className="input input-md" />
                    </label>

                    <input type="text" name="id" defaultValue={card.id} hidden />
                    <div className="justify-end card-actions">
                        <button className="btn btn-primary">Save</button>
                    </div>
                </Form>
            </div>
        </div>

    </main >
}
