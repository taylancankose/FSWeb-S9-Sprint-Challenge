import axios from "axios";
import React, { useState, useEffect } from "react";

// önerilen başlangıç stateleri

const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4;
//  "B" nin bulunduğu indexi
const initialValues = {
  initialMessage,
  initialEmail,
  initialSteps,
  initialIndex,
};
export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
  const [form, setForm] = useState(initialValues);

  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    const x = Number(form.initialIndex % 3) + 1;
    const y = Number(Math.floor(form.initialIndex / 3) + 1);

    return { x, y };
  }

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    const data = getXY();
    return `(${data.x}, ${data.y})`;
  }

  useEffect(() => {
    getXYMesaj();
  }, [form.initialIndex]);

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setForm(initialValues);
  }

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    if (yon === "SAĞ") {
      setForm({
        ...form,
        initialIndex: form.initialIndex + 1,
        initialSteps: form.initialSteps + 1,
        initialMessage: "",
      });
      if (
        form.initialIndex === 2 ||
        form.initialIndex === 5 ||
        form.initialIndex === 8
      ) {
        setForm({
          ...form,
          initialMessage: "Sağa gidemezsiniz",
        });
      }
    } else if (yon === "SOL") {
      setForm({
        ...form,
        initialIndex: form.initialIndex - 1,
        initialSteps: form.initialSteps + 1,
        initialMessage: "",
      });
      if (
        form.initialIndex === 0 ||
        form.initialIndex === 3 ||
        form.initialIndex === 6
      ) {
        setForm({
          ...form,
          initialMessage: "Sola gidemezsiniz",
        });
      }
    } else if (yon === "YUKARI") {
      setForm({
        ...form,
        initialIndex: form.initialIndex - 3,
        initialSteps: form.initialSteps + 1,
        initialMessage: "",
      });
      if (
        form.initialIndex === 0 ||
        form.initialIndex === 1 ||
        form.initialIndex === 2
      ) {
        setForm({
          ...form,
          initialMessage: "Yukarıya gidemezsiniz",
        });
      }
    } else if (yon === "ASAGI") {
      setForm({
        ...form,
        initialIndex: form.initialIndex + 3,
        initialSteps: form.initialSteps + 1,
        initialMessage: "",
      });
      if (
        form.initialIndex === 6 ||
        form.initialIndex === 7 ||
        form.initialIndex === 8
      ) {
        setForm({
          ...form,
          initialMessage: "Aşağıya gidemezsiniz",
        });
      }
    }
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setForm({
      ...form,
      initialEmail: evt.target.value,
    });
  }
  async function onSubmit(e) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    e.preventDefault();
    const { x, y } = getXY();
    const result = {
      x,
      y,
      steps: form.initialSteps,
      email: form.initialEmail,
    };
    try {
      const response = await axios.post(
        "http://localhost:9000/api/result",
        result
      );
      await setForm({
        ...form,
        initialMessage: response?.data?.message,
        initialEmail: "",
      });
    } catch (error) {
      await setForm({
        ...initialValues,
        initialMessage: error?.response?.data?.message,
      });
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Koordinatlar {getXYMesaj()}</h3>
        <h3 id="steps">{form.initialSteps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className={`square${idx === form.initialIndex ? " active" : ""}`}
          >
            {idx === form.initialIndex ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message" data-testid="message">
          {form.initialMessage}
        </h3>
      </div>
      <div id="keypad">
        <button
          data-testid="left"
          id="left"
          onClick={() => sonrakiIndex("SOL")}
        >
          SOL
        </button>
        <button data-testid="up" id="up" onClick={() => sonrakiIndex("YUKARI")}>
          YUKARI
        </button>
        <button
          data-testid="right"
          id="right"
          onClick={() => sonrakiIndex("SAĞ")}
        >
          SAĞ
        </button>
        <button
          data-testid="down"
          id="down"
          onClick={() => sonrakiIndex("ASAGI")}
        >
          AŞAĞI
        </button>
        <button data-testid="reset" id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form type="submit" onSubmit={onSubmit} data-testid="emailForm">
        <input
          id="email"
          type="email"
          placeholder="email girin"
          name="email"
          value={form.initialEmail}
          onChange={onChange}
          data-testid="email"
        />
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
