export const date = "text-sm text-slate-600"

export const pages = {
    root: "max-w-full md:max-w-3/4 mx-auto px-4 py-6",
    title: "text-4xl font-bold mb-1.5",
    description: "text-lg py-2",
    subtitle: "text-2xl font-semibold",
    section: "text-xl font-semibold mt-5 mb-1"
}

export const cards = {
    group: "flex flex-wrap gap-x-2 gap-y-4 mx-auto justify-center",
    container: "border border-sm rounded-xl p-2 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] flex flex-col",
    containerSmall: "border border-sm rounded-xl p-2 w-full sm:w-[calc(33.333%-0.67rem)] lg:w-[calc(20%-0.8rem)] flex flex-col",
    header: "",
    title: "text-xl font-semibold",
    subtitle: "text-sm capitalize italic",
    description: "my-auto py-2.5",
    tags: "text-xs flex flex-wrap items-center justify-center gap-4 mt-auto",
    footer: "mt-auto",
}

export const buttons = {
    container: "flex justify-center gap-3",
    button: "inline-flex items-center justify-center mb-3 mt-2 rounded-full border border-slate-300 bg-white px-6 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-4 focus-visible:ring-slate-200 focus-visible:outline-hidden",
    buttonSmall: "inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-1 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-4 focus-visible:ring-slate-200 focus-visible:outline-hidden",
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