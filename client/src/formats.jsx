export const title = "text-xl"
export const date = "text-xs"
export const description = ""

export const cards = {
    container: "grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-4",
    title: "text-lg"
}

export const buttons = {
    container: "flex justify-center gap-4",
    button: ""
}

export const forms = {
    container: "",
    label: "",
    input: "",
    checkbox: ""
}


export function LoadingSpinner() {
    return (
        <div class="text-center mt-6" role="status">
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

            <p class="mt-2 font-medium text-gray-700">Loading...</p>
        </div>
    )
}

export function ErrorMessage({ error }) {
    return (
        <p><span className="bold text-red">Error:</span> {error}</p>
    )
}