/** @format */

import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import dotenv from "dotenv";
import getUserData from "../helpers/userData";
dotenv.config();
// Specify the path to the .env file
const envPath = path.resolve(__dirname, "../../.env");

// Load environment variables from the specified file
dotenv.config({ path: envPath });

console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("API key is not defined in the environment variables");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function processResultText(text: string) {
  const lines = text.split("\n");
  let explanation = "";
  let firstAidRecommendation = "";
  for (let line of lines) {
    if (line.includes("explanation")) {
      explanation = line.split('"explanation": ')[1].replace(/"/g, "");
    }
    if (line.includes("firstAidRecommendation")) {
      firstAidRecommendation = line
        .split('"firstAidRecommendation": ')[1]
        .replace(/"/g, "");
    }
  }
  return { explanation, firstAidRecommendation };
}
const parts = [
  {
    text: "Buatlah penjelasan dari penyakit dari kolom predict dan tampilkan hasilnya di kolom result dengan explanation dan firstAidrecommendation. Dalam firstAidRecommendation berikan umur, gender, berat dari masing-masing inputan yang dibutuhkan dengan menggunakan bahasa indonesia dalam bentuk JSON object.",
  },
  { text: "predict: Melanocytic nevus, 20, 65, male" },
  {
    text: 'result: "explanation": "Pasien berusia 20 tahun dengan berat badan 65 kg dan berjenis kelamin laki-laki didiagnosis menderita melanocytic nevus, yang merupakan jenis lesi kulit yang berasal dari melanosit, sel-sel yang bertanggung jawab untuk memproduksi melanin, pigmen yang memberikan warna pada kulit. Melanocytic nevus dapat muncul di mana saja di kulit dan bervariasi dalam warna, ukuran, dan bentuk. Meskipun sebagian besar bersifat jinak, beberapa dapat berkembang menjadi melanoma, suatu bentuk kanker kulit yang serius."\n"firstAidRecommendation":  "Pasien disarankan untuk melakukan pemeriksaan diri secara teratur untuk menemukan tahi lalat baru atau perubahan pada yang sudah ada. Gunakan cermin atau minta bantuan seseorang untuk memeriksa area yang sulit dilihat. Selain itu, penting untuk mengikuti aturan ABCDE untuk mengidentifikasi tahi lalat yang mencurigakan, seperti Asymmetry (Asimetri), Border (Tepi), Color (Warna), Diameter (Diameter), dan Evolving (Berkembang). Untuk melindungi kulit dari paparan sinar matahari, gunakan tabir surya spektrum luas dengan SPF 30 atau lebih, serta kenakan pakaian pelindung, topi, dan kacamata hitam saat berada di luar ruangan. Selalu cari tempat teduh selama jam matahari puncak (10 AM sampai 4 PM). Lindungi tahi lalat dari cedera atau iritasi, terutama jika berada di area yang rentan terhadap gesekan. Jika tahi lalat terluka secara tidak sengaja dan mulai berdarah, bersihkan area tersebut dengan sabun dan air, oleskan antiseptik, dan tutup dengan plester. Pantau tanda-tanda infeksi dan jadwalkan pemeriksaan kulit secara teratur dengan dokter kulit, terutama jika ada riwayat keluarga dengan kanker kulit atau jika terdapat banyak tahi lalat. Minta nasihat medis jika Anda melihat perubahan pada tahi lalat atau jika muncul tahi lalat baru yang tampak tidak biasa."',
  },
  { text: "predict:" },
];

async function generateContentWithLabel(label: string, userId: string) {
  console.log(label);
  const userData = await getUserData(userId);
  const { age, weight, gender } = userData;
  console.log(userData);

  parts.push({ text: `predict: ${label}, ${age}, ${weight}, ${gender}` });
  parts.push({ text: "result: " });

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
  });
  console.log(result.response.text());
  const resultText = result.response.text();
  const { explanation, firstAidRecommendation } = await processResultText(
    resultText
  );
  return { explanation, firstAidRecommendation };
}

export default generateContentWithLabel;
