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
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.8,
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
    text: 'result: "explanation": "Pasien berusia 20 tahun dengan berat badan 65 kg dan berjenis kelamin laki-laki didiagnosis menderita melanocytic nevus, yang merupakan jenis lesi kulit yang berasal dari melanosit, sel-sel yang memproduksi melanin. Melanocytic nevus dapat muncul di mana saja di kulit dan bervariasi dalam warna, ukuran, dan bentuk. Sebagian besar bersifat jinak, namun beberapa dapat berkembang menjadi melanoma, suatu bentuk kanker kulit yang serius."\n"firstAidRecommendation":  "Pasien disarankan melakukan pemeriksaan diri secara teratur untuk menemukan tahi lalat baru atau perubahan pada yang sudah ada. Gunakan aturan ABCDE untuk mengidentifikasi tahi lalat yang mencurigakan. Gunakan tabir surya SPF 30 atau lebih, kenakan pakaian pelindung, dan hindari paparan sinar matahari selama jam puncak."',
  },
  { text: "predict: Basal cell carcinoma, 45, 80, female" },
  {
    text: 'result: "explanation": "Pasien berusia 45 tahun dengan berat badan 80 kg dan berjenis kelamin perempuan didiagnosis dengan basal cell carcinoma, jenis kanker kulit yang paling umum. Kanker ini biasanya terjadi akibat paparan sinar matahari berlebihan dan sering muncul di wajah, leher, atau tangan."\n"firstAidRecommendation": "Pasien disarankan untuk menghindari paparan sinar matahari langsung, menggunakan tabir surya spektrum luas dengan SPF 30 atau lebih, dan mengenakan pakaian pelindung. Pemeriksaan kulit secara teratur dengan dokter kulit sangat penting untuk mendeteksi perubahan kulit dini."',
  },
  { text: "predict: Psoriasis, 35, 70, male" },
  {
    text: 'result: "explanation": "Pasien berusia 35 tahun dengan berat badan 70 kg dan berjenis kelamin laki-laki didiagnosis menderita psoriasis, penyakit kulit autoimun kronis yang ditandai dengan munculnya bercak-bercak kulit merah dan bersisik."\n"firstAidRecommendation": "Pasien disarankan untuk menjaga kulit tetap lembab dengan menggunakan pelembab, menghindari pemicu seperti stres dan cedera kulit, serta mengikuti rencana perawatan yang diberikan oleh dokter. Hindari menggaruk area yang terkena dan gunakan pakaian longgar untuk mengurangi iritasi."',
  },
  { text: "predict: Actinic keratosis, 60, 75, female" },
  {
    text: 'result: "explanation": "Pasien berusia 60 tahun dengan berat badan 75 kg dan berjenis kelamin perempuan didiagnosis dengan actinic keratosis, kondisi pra-kanker yang disebabkan oleh paparan sinar matahari berlebihan. Lesi ini biasanya muncul sebagai bercak kasar pada kulit."\n"firstAidRecommendation": "Pasien disarankan untuk menghindari paparan sinar matahari, menggunakan tabir surya dengan SPF tinggi, mengenakan pakaian pelindung, dan memeriksa kulit secara teratur. Pemeriksaan rutin dengan dokter kulit juga penting untuk mendeteksi perubahan yang mencurigakan."',
  },
  { text: "predict: Squamous cell carcinoma, 55, 85, male" },
  {
    text: 'result: "explanation": "Pasien berusia 55 tahun dengan berat badan 85 kg dan berjenis kelamin laki-laki didiagnosis dengan squamous cell carcinoma, jenis kanker kulit yang berkembang pada sel-sel skuamosa di lapisan tengah dan luar kulit. Kanker ini sering disebabkan oleh paparan sinar UV."\n"firstAidRecommendation": "Pasien disarankan untuk melindungi kulit dari sinar matahari dengan menggunakan tabir surya, mengenakan pakaian pelindung, dan memeriksa kulit secara teratur. Segera konsultasikan dengan dokter jika ada luka yang tidak sembuh atau perubahan pada kulit."',
  },
  { text: "predict: Eczema, 30, 60, female" },
  {
    text: 'result: "explanation": "Pasien berusia 30 tahun dengan berat badan 60 kg dan berjenis kelamin perempuan didiagnosis menderita eczema, kondisi kulit kronis yang menyebabkan gatal, kemerahan, dan peradangan."\n"firstAidRecommendation": "Pasien disarankan untuk menjaga kulit tetap lembab dengan menggunakan pelembab bebas pewangi, menghindari sabun keras, dan mengelola stres. Hindari menggaruk area yang terkena dan gunakan pakaian yang tidak menyebabkan iritasi."',
  },
  { text: "predict: Vitiligo, 25, 70, male" },
  {
    text: 'result: "explanation": "Pasien berusia 25 tahun dengan berat badan 70 kg dan berjenis kelamin laki-laki didiagnosis menderita vitiligo, kondisi kulit yang ditandai dengan hilangnya pigmen melanin, menyebabkan bercak putih pada kulit."\n"firstAidRecommendation": "Pasien disarankan untuk menggunakan tabir surya untuk melindungi area yang tidak memiliki pigmen, mengenakan pakaian pelindung, dan mengikuti rencana perawatan yang disarankan oleh dokter. Hindari paparan sinar matahari berlebihan dan gunakan kosmetik untuk menutupi bercak putih jika diinginkan."',
  },
  { text: "predict: Rosacea, 40, 65, female" },
  {
    text: 'result: "explanation": "Pasien berusia 40 tahun dengan berat badan 65 kg dan berjenis kelamin perempuan didiagnosis menderita rosacea, kondisi kulit kronis yang menyebabkan kemerahan dan pembuluh darah terlihat di wajah."\n"firstAidRecommendation": "Pasien disarankan untuk menghindari pemicu seperti makanan pedas, alkohol, dan suhu ekstrem. Gunakan pembersih lembut dan pelembab, serta tabir surya spektrum luas. Ikuti perawatan yang disarankan oleh dokter kulit."',
  },
  { text: "predict: Contact dermatitis, 50, 80, male" },
  {
    text: 'result: "explanation": "Pasien berusia 50 tahun dengan berat badan 80 kg dan berjenis kelamin laki-laki didiagnosis dengan contact dermatitis, reaksi kulit yang terjadi akibat kontak dengan alergen atau iritan."\n"firstAidRecommendation": "Pasien disarankan untuk menghindari kontak dengan bahan yang memicu reaksi, menggunakan sabun lembut, dan menjaga kulit tetap lembab. Oleskan krim kortikosteroid sesuai resep dokter untuk mengurangi peradangan dan gatal."',
  },
  { text: "predict: Seborrheic dermatitis, 35, 75, female" },
  {
    text: 'result: "explanation": "Pasien berusia 35 tahun dengan berat badan 75 kg dan berjenis kelamin perempuan didiagnosis dengan seborrheic dermatitis, kondisi kulit yang menyebabkan bercak bersisik dan kulit merah, biasanya di kulit kepala."\n"firstAidRecommendation": "Pasien disarankan untuk menggunakan sampo khusus yang mengandung zinc pyrithione, ketoconazole, atau selenium sulfide. Hindari penggunaan produk rambut yang dapat menyebabkan iritasi dan ikuti petunjuk perawatan dari dokter."',
  },
  { text: "result: " },
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
