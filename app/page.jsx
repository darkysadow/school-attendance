import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-20 items-center p-24">
      <section className="flex flex-row-reverse justify-between items-center w-full">
        <div className="text-right w-[50%]">
          <h1 className=" text-2xl font-semibold">Вітаємо в системі контролю<br /> відвідуваністю <span className="font-pacifico"><span className="text-red-600">є</span>Журнал</span> !</h1>
          <p className="mt-5 ">
          Наукові дослідження підтверджують, що регулярна відвідуваність уроків є важливим чинником успіху в навчанні. Наша система контролю відвідуваністю дозволить батькам та вчителям з легкістю відслідковувати присутність учнів у школі
            Запрошуємо вас використовувати нашу систему для <br /> створення сприятливого середовища для <br />успіху вашої дитини у навчанні. Разом <br />ми будуємо майбутнє нашої освіти!</p>
        </div>
        <div>
          <Image 
            src={'/landing1.jpg'}
            width={300}
            height={300}
          />
        </div>
      </section>
      <section className="flex flex-row-reverse justify-between items-center w-full">
        <div className="relative w-[300px] h-[300px]">
        <Image 
          src={'/landing2.jpg'}
          fill
          style={{
            objectFit: 'cover',
            borderRadius: '100%',
          }}
        />
        </div>
        <div className="flex w-[50%] text-left">
          <p className="px-[20px]">
          <span className="ml-[-20px] text-xl font-semibold">Основні <span className="text-red-600">функції</span>:</span> <br /><br />
          <span className="ml-[-10px] text-lg font-medium">Зручний доступ:</span><br />
          Отримуйте швидкий та зручний доступ до інформації про відвідуваність вашої дитини.<br />
          <span className="ml-[-10px] text-lg font-medium">Індивідуальний підхід:</span><br />
          Для вчителів - можливість встановлення стану відвідуваності та виставлення оцінок для кожного учня окремо.<br />
          <span className="ml-[-10px] text-lg font-medium">Широкі можливості для батьків:</span><br />
          Батьки можуть миттєво отримувати повідомлення про відвідуваність та успішність своєї дитини.
          </p>
        </div>
      </section>
    </main>
  )
}
