export const FiltroOptions = ({ label, values, setOptions, value, initialState }) => {
    return (
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg  min-w-sm max-w-sm">
            

            <select
                id={label}
                name={label}
                value={value}
                onChange={(e) => setOptions(e.target.value)}
                className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
                <option value="">{initialState}</option>
                {values.map((value) => (
                    <option key={value.id} value={value.id}>
                        {value.nombre}
                    </option>
                ))}
            </select>
        </div>
    );
};
