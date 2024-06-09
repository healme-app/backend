/** @format */

import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import dotenv from "dotenv";
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
    text: "Buatlah penjelasan dari penyakit dari kolom predict dan tampilkan hasilnya di kolom result dengan explanation dan firstAidRecommendation yang dibutuhkan dengan menggunakan bahasa indonesia dalam bentuk JSON object.",
  },
  { text: "predict: Melanocytic nevus" },
  {
    text: 'result: "explanation": "Melanocytic nevus, yang biasa dikenal sebagai tahi lalat, adalah jenis lesi kulit yang berasal dari melanosit, sel-sel yang bertanggung jawab untuk memproduksi melanin, pigmen yang memberikan warna pada kulit. Tahi lalat ini dapat ada sejak lahir (congenital melanocytic nevi) atau berkembang kemudian dalam hidup (acquired melanocytic nevi). Mereka dapat muncul di mana saja di kulit dan bervariasi dalam warna (biasanya cokelat, hitam, atau kuning tua), ukuran, dan bentuk. Sebagian besar melanocytic nevi bersifat jinak dan tidak menyebabkan masalah kesehatan. Namun, beberapa dapat berkembang menjadi melanoma, suatu bentuk kanker kulit yang serius."\n"firstAidRecommendation":  "Meskipun melanocytic nevi biasanya tidak memerlukan pertolongan pertama, ada beberapa rekomendasi umum untuk memantau dan mengelolanya:Pemeriksaan Diri Secara Teratur:Periksa kulit Anda secara teratur untuk menemukan tahi lalat baru atau perubahan pada yang sudah ada. Gunakan cermin atau minta bantuan seseorang untuk memeriksa area yang sulit dilihat.Ikuti aturan ABCDE untuk mengidentifikasi tahi lalat yang mencurigakan:Asymmetry (Asimetri): Satu setengah dari tahi lalat tidak cocok dengan setengah lainnya.Border (Tepi): Tepi tidak teratur, bergerigi, atau kabur.Color (Warna): Bervariasi dari satu area ke area lain; termasuk nuansa cokelat, hitam, atau kadang-kadang bercak merah, putih, atau biru.Diameter (Diameter): Lebih besar dari 6 milimeter (sekitar ukuran penghapus pensil), meskipun melanoma bisa lebih kecil.Evolving (Berkembang): Perubahan ukuran, bentuk, warna, atau elevasi, atau gejala baru seperti pendarahan, gatal, atau berkerak.Perlindungan dari Matahari:Gunakan tabir surya spektrum luas dengan SPF 30 atau lebih untuk melindungi kulit Anda dari sinar UV yang berbahaya.Kenakan pakaian pelindung, topi, dan kacamata hitam saat berada di luar ruangan.Carilah tempat teduh selama jam matahari puncak (10 AM sampai 4 PM).Hindari Trauma:Lindungi tahi lalat dari cedera atau iritasi, terutama jika berada di area yang rentan terhadap gesekan (misalnya, di bawah tali bra atau ikat pinggang).Jika tahi lalat terluka secara tidak sengaja dan mulai berdarah, bersihkan area tersebut dengan sabun dan air, oleskan antiseptik, dan tutup dengan plester. Pantau tanda-tanda infeksi.Konsultasi Medis:Jadwalkan pemeriksaan kulit secara teratur dengan dokter kulit, terutama jika Anda memiliki riwayat keluarga kanker kulit atau banyak tahi lalat.Minta nasihat medis jika Anda melihat perubahan pada tahi lalat atau jika muncul tahi lalat baru yang tampak tidak biasa.Dengan mengikuti pedoman ini, Anda dapat memantau melanocytic nevi Anda dengan efektif dan mencari perhatian medis segera jika terjadi perubahan yang mengkhawatirkan."',
  },
  { text: "predict: " },
];

async function generateContentWithLabel(label: string) {
  parts.push({ text: `predict: ${label}` });
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
