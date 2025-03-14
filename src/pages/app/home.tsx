export function Home() {
  return (
    <div className="flex min-h-screen bg-background dark:bg-dark-background">
      <main className="flex-1 p-6 flex gap-6">
        <div className="w-1/2 flex flex-col">
          <section className="p-6 py-16 rounded-lg mb-6">
            <h2 className="text-2xl font-bold font-roboto text-center">Avaliações</h2>
            <div className="flex justify-center my-4">
              <span className="text-yellow-400 text-6xl">★★★★★</span>
              <span className="text-gray-400 text-6xl">★</span>
            </div>
            <p className="text-center font-bold text-lg">4.0/5.0</p>
          </section>

          <div className="border-t border-gray-300 my-4"></div>

          <section className="p-6 py-16 rounded-lg">
            <h2 className="text-2xl font-bold font-roboto text-center">Promoções Ativas</h2>
            <div className="flex justify-center gap-4 mt-10">
              {[1, 2].map((_, index) => (
                <div key={index} className="w-40 h-24 bg-black flex items-center justify-center text-white rounded-lg-md">
                  <img src="/images/promo/promo.svg" alt="" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="w-px bg-gray-300 mx-6"></div>

        <section className="w-1/2 p-4 rounded-lg h-[38rem] overflow-y-auto">
          <h2 className="text-2xl font-bold font-roboto text-center">O que os clientes estão achando?</h2>
          <div className="space-y-4 mt-4">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="border-b border-gray-300 pb-4">
                <p className="text-gray-600 dark:text-white">
                  "A comida desse lugar é sensacional. Eu e minha esposa comemos quase todo o domingo!!!"
                </p>
                <div className="flex items-center justify-between text-yellow-400 text-lg">
                  <span>★★★★★</span>
                  <span className="text-gray-400 text-sm">01/01/2022</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
