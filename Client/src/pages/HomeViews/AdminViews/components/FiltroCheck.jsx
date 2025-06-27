export const FiltroCheck = ({ check, setCheck, label }) => {
    return (
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg w-fit max-w-sm">
            <input
                type="checkbox"
                id={label}
                checked={check}
                onChange={(e) => setCheck(e.target.checked)}
                className="form-checkbox h-5 w-5 text-purple-600 focus:ring-purple-500 rounded"
            />
            <label htmlFor={label} className="text-sm font-medium text-gray-700">
                {label}
            </label>
        </div>
    );
};
