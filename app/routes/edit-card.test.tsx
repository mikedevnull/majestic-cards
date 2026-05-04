import { createRoutesStub } from "react-router";
import userEvent from '@testing-library/user-event'
import {
    render,
    screen,
    waitFor,
} from "@testing-library/react";

import CardEditor from "./edit-card";

describe('Card editor', () => {
    it('Render editor with current values', async () => {
        const Stub = createRoutesStub([
            {
                path: "/editCard/:id",
                Component: CardEditor,
                loader: () => {
                    return {
                        card: {
                            id: 2,
                            title: "Some title",
                            subtitle: "Subtitle",
                            target: "foo:bar"
                        }
                    }
                },
                action() { }
            },
        ]);

        render(<Stub initialEntries={["/editCard/2"]}></Stub>);
        const titleBox = await waitFor(() => screen.findByLabelText<HTMLInputElement>('Title'));
        const subtitleBox = await screen.findByLabelText<HTMLInputElement>('Subtitle');
        const targetBox = await screen.findByLabelText<HTMLInputElement>('Target');
        expect(titleBox).toBeInTheDocument();
        expect(titleBox.value).toBe('Some title');
        expect(subtitleBox).toBeInTheDocument();
        expect(subtitleBox.value).toBe('Subtitle');
        expect(targetBox).toBeInTheDocument();
        expect(targetBox.value).toBe('foo:bar');
        expect(targetBox.readOnly).toBeTruthy();
    })

    it('Save button triggers action with changed values', async () => {
        const action = vi.fn()
        const Stub = createRoutesStub([
            {
                path: "/editCard/:id",
                Component: CardEditor,
                loader: () => {
                    return {
                        card: {
                            id: 2,
                            title: "Some title",
                            subtitle: "Subtitle",
                            backendUrl: "foo:bar"
                        }
                    }
                },
                action
            },
        ]);

        render(<Stub initialEntries={["/editCard/2"]}></Stub>);
        const titleBox = await waitFor(() => screen.findByLabelText<HTMLInputElement>('Title'));
        const subtitleBox = await screen.findByLabelText<HTMLInputElement>('Subtitle');
        const user = userEvent.setup()
        await user.clear(titleBox);
        await user.keyboard('New title');
        await user.clear(subtitleBox);
        await user.keyboard('New subtitle');
        const submitButton = await screen.findByRole('button');
        await user.click(submitButton)

        expect(action).toHaveBeenCalledOnce();
        const { request } = action.mock.calls[0][0];
        const formData = await request.formData()
        console.log(formData)
        expect(formData.get('title')).toBe("New title");
        expect(formData.get('subtitle')).toBe("New subtitle");
        expect(formData.get('target')).toBe("foo:bar");
        expect(formData.get('id')).toBe("2");
    })
})