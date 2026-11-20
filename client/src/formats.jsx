export const title = "text-3xl font-bold"
export const date = "text-sm"
export const description = "my-2"

export const pages = {
    title: "text-4xl font-semibold",
    subtitle: "text-2xl",
    section: "text-lg font-semibold"
}

export const cards = {
    group: "grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-4",
    container: "border border-sm p-1",
    title: "text-lg ",
    subtitle: "text-sm capitalize italic",
}

export const buttons = {
    container: "flex justify-center gap-4",
    button: "",
    buttonSmall: "",
}

export const forms = {
    container: "",
    label: "",
    input: "",
    checkbox: "",
}

export function IsoDateFormatter(date) {
    return date.slice(0, 10).split("-").slice(1).concat(date.slice(0, 4)).join("-")
}


export function LoadingSpinner() {
    return (
        <div className="text-center mt-6" role="status">
            <svg
                className="mx-auto size-8 animate-spin text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>

                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>

            <p className="mt-2 font-medium text-gray-700">Loading...</p>
        </div>
    )
}

export function ErrorMessage({ error }) {
    return (
        <p><span className="bold text-red">Error:</span> {error}</p>
    )
}