export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-sky-600 shadow-sm focus:ring-sky-500 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-sky-600 dark:focus:ring-offset-gray-800 ' +
                className
            }
        />
    );
}
