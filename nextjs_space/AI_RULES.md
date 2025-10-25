# AI Development Rules

This document outlines the technical stack and coding conventions for the AI assistant working on this project. Following these rules ensures consistency, maintainability, and adherence to best practices.

## Tech Stack

This is a modern web application built with the following technologies:

-   **Framework**: [Next.js](https://nextjs.org/) (App Router) for full-stack React development.
-   **Language**: [TypeScript](https://www.typescriptlang.org/) for static typing and improved developer experience.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first CSS workflow.
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/) for a collection of beautifully designed, accessible, and customizable components built on Radix UI.
-   **Database ORM**: [Prisma](https://www.prisma.io/) for type-safe database access and schema management.
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/) for handling user authentication and sessions.
-   **File Storage**: [AWS S3](https://aws.amazon.com/s3/) for cloud-based file storage, managed via the AWS SDK.
-   **Form Management**: [React Hook Form](https://react-hook-form.com/) for performant and flexible form handling, paired with [Zod](https://zod.dev/) for schema validation.
-   **API Communication**: Route Handlers in Next.js for creating API endpoints.

## Library Usage Rules

To maintain a clean and consistent codebase, please adhere to the following library usage guidelines:

-   **UI & Components**:
    -   **Primary Choice**: Always use components from the `@/components/ui` directory (shadcn/ui).
    -   **Custom Components**: If a specific component is not available in shadcn/ui, create a new component in `@/components` using Radix UI primitives and Tailwind CSS for styling.
    -   **DO NOT** install new, one-off component libraries.

-   **Styling**:
    -   **Primary Choice**: Use Tailwind CSS utility classes directly in your JSX.
    -   **Conditional Classes**: Use the `cn` utility from `@/lib/utils` for merging and applying conditional classes.
    -   **AVOID**: Do not use inline styles (`style={{}}`) or create separate `.css` files for component-specific styles.

-   **Icons**:
    -   **Primary Choice**: Use icons from the `lucide-react` library. It is already installed and provides a comprehensive set of high-quality icons.

-   **Forms**:
    -   **Primary Choice**: Use `react-hook-form` for all form logic.
    -   **Integration**: Integrate `react-hook-form` with shadcn/ui's `Form` components (`@/components/ui/form`) for seamless integration and accessibility.
    -   **Validation**: Use `zod` to define validation schemas for your forms.

-   **State Management**:
    -   **Local State**: Use React's built-in hooks (`useState`, `useReducer`) for component-level state.
    -   **Global State**: For cross-component state, `zustand` is available. Use it to create simple, accessible stores.

-   **Data Fetching & API Calls**:
    -   **Client-Side**: Use `SWR` or `TanStack Query` for client-side data fetching, caching, and revalidation.
    -   **Server-Side**: Use native `fetch` within Server Components, Route Handlers, or Server Actions.

-   **Notifications (Toasts)**:
    -   **Primary Choice**: Use the `useToast` hook from `@/hooks/use-toast.ts` and the `<Toaster />` component from `@/components/ui/toaster.tsx`. This is the integrated shadcn/ui toast system.

-   **Database Interactions**:
    -   **Primary Choice**: All database queries must be performed through the `prisma` client instance exported from `@/lib/db.ts`.
    -   **DO NOT** connect to the database directly.

-   **File Handling**:
    -   **Primary Choice**: Use the helper functions provided in `@/lib/s3.ts` (`uploadFile`, `deleteFile`) for all interactions with AWS S3.