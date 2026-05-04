import { createRoutesStub } from "react-router";
import userEvent from '@testing-library/user-event'
import {
    render,
    screen,
    waitFor,
} from "@testing-library/react";

import CardEditor from "./edit-card";
import { action as cardEditorAction, loader as cardEditorLoader } from './edit-card'
import { mock } from 'vitest-mock-extended';
import prisma from "~/lib/__mocks__/prisma";

vi.mock('~/lib/prisma')

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
        expect(formData.get('title')).toBe("New title");
        expect(formData.get('subtitle')).toBe("New subtitle");
        expect(formData.get('target')).toBe("foo:bar");
        expect(formData.get('id')).toBe("2");
    })

    describe('action', () => {

        it('Update database entry with provided form data', async () => {
            const formData = new FormData()
            formData.set('title', "Foo")
            formData.set('subtitle', "Bar")
            formData.set('backendUrl', "album:123")
            formData.set('id', "2")
            const fakeRequest = mock<Request>()
            fakeRequest.formData.mockResolvedValue(formData)
            const actionArgs: Parameters<typeof cardEditorAction>[0] = {
                request: fakeRequest,
                unstable_url: new URL('http://localhost/editCard/2'),
                params: { cardId: '2' },
                unstable_pattern: '/editCard/:id',
                context: {},
            };

            const resp = await cardEditorAction(actionArgs);
            expect(resp.status).toBe(302);
            expect(resp.headers.get('Location')).toBe('/');
            expect(prisma.playbackItem.update).toHaveBeenCalledExactlyOnceWith({
                where: { id: 2 },
                data: { id: 2, subtitle: "Bar", title: "Foo", backendUrl: "album:123" }
            });
        })

        it('Update database entry with provided form data for partial data', async () => {
            const formData = new FormData()
            formData.set('title', "Foo")
            formData.set('id', "2")
            const fakeRequest = mock<Request>()
            fakeRequest.formData.mockResolvedValue(formData)
            const actionArgs: Parameters<typeof cardEditorAction>[0] = {
                request: fakeRequest,
                unstable_url: new URL('http://localhost/editCard/2'),
                params: { cardId: '2' },
                unstable_pattern: '/editCard/:id',
                context: {},
            };

            const resp = await cardEditorAction(actionArgs);
            expect(resp.status).toBe(302);
            expect(resp.headers.get('Location')).toBe('/');
            expect(prisma.playbackItem.update).toHaveBeenCalledExactlyOnceWith({
                where: { id: 2 },
                data: { id: 2, title: "Foo" }
            });
        })

        it('No update if form data fails validation - no id', async () => {
            const formData = new FormData()
            formData.set('title', "Foo")
            const fakeRequest = mock<Request>()
            fakeRequest.formData.mockResolvedValue(formData)
            const actionArgs: Parameters<typeof cardEditorAction>[0] = {
                request: fakeRequest,
                unstable_url: new URL('http://localhost/editCard/2'),
                params: { cardId: '2' },
                unstable_pattern: '/editCard/:id',
                context: {},
            };

            await expect(cardEditorAction(actionArgs)).rejects.toThrow();
            expect(prisma.playbackItem.update).toHaveBeenCalledTimes(0);
        })

        it('No update if form data fails validation - additional data', async () => {
            const formData = new FormData()
            formData.set('id', "2")
            formData.set('some-fancy-unexpected-data', "foo")
            const fakeRequest = mock<Request>()
            fakeRequest.formData.mockResolvedValue(formData)
            const actionArgs: Parameters<typeof cardEditorAction>[0] = {
                request: fakeRequest,
                unstable_url: new URL('http://localhost/editCard/2'),
                params: { cardId: '2' },
                unstable_pattern: '/editCard/:id',
                context: {},
            };

            await expect(cardEditorAction(actionArgs)).rejects.toThrow();
            expect(prisma.playbackItem.update).toHaveBeenCalledTimes(0);
        })
    })

    describe('loader', () => {

        it('Update database entry with provided form data for partial data', async () => {

            const fakeRequest = mock<Request>()
            const loaderArgs: Parameters<typeof cardEditorLoader>[0] = {
                request: fakeRequest,
                unstable_url: new URL('http://localhost/editCard/2'),
                params: { cardId: '2' },
                unstable_pattern: '/editCard/:id',
                context: {},
            };

            prisma.playbackItem.findUnique.mockResolvedValue({
                id: 2,
                title: "Some title",
                subtitle: "Subtitle>",
                backendUrl: "album:321",
                imageUrl: "/api/artwork",
                triggerId: null
            })

            const resp = await cardEditorLoader(loaderArgs);
            expect(resp).toStrictEqual({
                card: {
                    id: 2,
                    title: "Some title",
                    subtitle: "Subtitle>",
                    backendUrl: "album:321",
                    imageUrl: "/api/artwork",
                    triggerId: null
                }
            })
        })

        it('Returns 404 if card with id was not found', async () => {

            const fakeRequest = mock<Request>()
            const loaderArgs: Parameters<typeof cardEditorLoader>[0] = {
                request: fakeRequest,
                unstable_url: new URL('http://localhost/editCard/2'),
                params: { cardId: '2' },
                unstable_pattern: '/editCard/:id',
                context: {},
            };

            prisma.playbackItem.findUnique.mockResolvedValue(null)

            await expect(cardEditorLoader(loaderArgs)).rejects.toThrow();
        })
    })
})