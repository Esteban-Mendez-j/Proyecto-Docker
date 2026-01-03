import { ListSvg } from "./Icons";

export default function SinResultados({titulo, subTitulo }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center text-gray-600 w-full">
            <ListSvg name={"info"} height={50} width={50} nameClass=' mb-4 text-gray-400 fill-gray-400' />
            <p className="text-lg font-semibold">{titulo}</p>
            <p className="text-sm text-gray-500 mt-1">{subTitulo}</p>
        </div>
    )
}