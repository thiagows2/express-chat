export default function Home() {
  return (
    <main className="flex items-center p-4 mx-auto min-h-screen justify-center">
      <div className="flex flex-col w-60 gap-4 items-center">
        <input
          type="text"
          placeholder="Digite seu nome"
          className="outline-none py-2 px-2 rounded-md text-white bg-black w-full"
        />
        <button className="bg-black px-3 py-2 rounded-md w-full hover:bg-gray-600 transition-all">
          Continuar
        </button>
      </div>
    </main>
  )
}
