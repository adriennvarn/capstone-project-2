export const date = "text-sm text-slate-600"

export const pages = {
    root: "max-w-full md:max-w-3/4 mx-auto px-4 py-6",
    title: "text-4xl font-bold text-accent text-shadow-sm mb-4",
    description: "text-lg py-2",
    subtitle: "text-2xl font-semibold",
    section: "text-xl font-semibold text-accent mt-5 mb-1"
}

export const cards = {
    group: "flex flex-wrap gap-x-2 gap-y-4 mx-auto justify-center",
    container: "border border-sm border-dark rounded-xl bg-white/70 p-2 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] flex flex-col",
    containerSmall: "border border-sm rounded-xl bg-white/70 p-2 w-full sm:w-[calc(33.333%-0.67rem)] lg:w-[calc(20%-0.8rem)] flex flex-col",
    title: "text-xl font-bold text-bright",
    subtitle: "text-sm capitalize italic",
    description: "my-auto py-2.5",
    tags: "text-xs text-slate-700 flex flex-wrap items-center justify-center gap-4 mt-auto",
    footer: "mt-auto",
}

export const buttons = {
    container: "flex justify-center gap-3 pt-1",
    button: "inline-flex items-center justify-center mb-3 mt-2 rounded-full border border-dark bg-white px-6 py-2 text-sm font-semibold text-dark shadow-sm shadow-accent transition-colors hover:border-black hover:bg-accent hover:text-white focus-visible:ring-4 focus-visible:ring-slate-200 focus-visible:outline-hidden",
    buttonSmall: "inline-flex items-center justify-center rounded-full border border-dark bg-white px-4 py-1 text-xs font-semibold text-dark shadow-sm shadow-accent transition-colors hover:border-black hover:bg-accent hover:text-white focus-visible:ring-4 focus-visible:ring-slate-200 focus-visible:outline-hidden",
}

export const forms = {
    container: "flex justify-center gap-x-4",
    containerVertical: "flex flex-col justify-center md:w-1/2 lg:w-1/3 mx-auto",
    label: "text-sm font-medium text-gray-700",
    input: "mt-2 p-2 w-full bg-white/70 rounded border border-gray-500 shadow-sm sm:text-sm",
    checkboxInput: "size-3 rounded border-gray-300 shadow-sm",
    checkboxItem: "flex items-center gap-x-2",
    checkboxLabel: "text-sm text-gray-700 cursor-pointer",
    checkboxLegend: "text-lg mx-auto mt-3 font-medium text-gray-900 mb-1",
    radioInput: "h-4 w-4 accent-blue-600",
    radioLabel: "text-sm text-gray-700 cursor-pointer",
    radioItem: "flex items-center gap-x-2",
    radioContainer: "flex items-center gap-x-6",
    radioLegend: "text-lg mx-auto mt-3 font-medium text-gray-900 mb-1 ",
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