export interface Template {
  id: string;
  message: string;
  category: string;
  language: string;
  label: string;
}

export const TEMPLATES: Template[] = [
  {
    id: "fam-1",
    message: "Happy Onam to our beloved family! May the spirit of Mahabali bring joy and togetherness to our home. Wishing everyone a beautiful harvest of love, laughter, and memories this Thiruvonam!",
    category: "Family",
    language: "English",
    label: "English Family Greeting",
  },
  {
    id: "fam-2",
    message: "Happy Onam, machane! Ellarjkum onam aashamsakal! Pookkalam ittu, mundu uduthu, onam sammanam! Mass aayi onam aaganam!",
    category: "Family",
    language: "Manglish",
    label: "Fun Manglish Family",
  },
  {
    id: "fam-3",
    message: "Dear family, this Onam let us come together like the colours of a Pookalam — each one unique, but together creating something beautiful. May our bonds grow stronger and our hearts fuller. Happy Onam!",
    category: "Family",
    language: "English",
    label: "Heartfelt Family",
  },
  {
    id: "fam-4",
    message: "parents-enum, attuestenum, ellavarkkum onam aashamsakal! Ninte sacrifices okke njan remember cheyyunnu. Love you appa, amma!",
    category: "Family",
    language: "Manglish",
    label: "Parents Manglish",
  },
  {
    id: "frnd-1",
    message: "Happy Onam, buddy! May your life be as colourful as a Pookalam and as joyful as an Onasadya feast! Wishing you a year full of success, laughter, and great vibes. Onashamsakal!",
    category: "Friends",
    language: "English",
    label: "Fun Friend Wish",
  },
  {
    id: "frnd-2",
    message: "Onam aashamsakal, kure kaalamayi nalla friend! Pookkalam pole jeevitham niranja happiness vannotte. Happy Onam machane!",
    category: "Friends",
    language: "Manglish",
    label: "Casual Friend Manglish",
  },
  {
    id: "prof-1",
    message: "Warm Onam greetings to you and your team! May this harvest festival bring prosperity, harmony, and fresh beginnings to all our professional endeavours. Happy Onam 2026!",
    category: "Professional",
    language: "English",
    label: "Professional Greeting",
  },
  {
    id: "rom-1",
    message: "Happy Onam, my love! You are the pookalam in the garden of my life — colourful, beautiful, and full of warmth. Every Onam is more special because I share it with you. Love you always.",
    category: "Romantic",
    language: "English",
    label: "Romantic Wish",
  },
  {
    id: "funny-1",
    message: "Happy Onam! May your plate be full of sadhya, your pocket full of onakkodi, and your phone full of onam wishes from everyone you know. Enjoy the food coma!",
    category: "Funny",
    language: "English",
    label: "Funny Sadhya Wish",
  },
  {
    id: "funny-2",
    message: "Onam aashamsakal! Sadyo kazhinjittu weight okke koodum enn ariyaam, pakshe ini onam varum alle! Declare cheyyuka — Onam weight is NOT real weight! Happy feasting!",
    category: "Funny",
    language: "Manglish",
    label: "Funny Sadhya Manglish",
  },
  {
    id: "trad-1",
    message: "Wishing you a blessed Thiruvonam! As the golden lamp lights up our homes and the Pookalam adorns our courtyards, may the grace of King Mahabali bring peace, prosperity, and happiness to your family. Onam Ashamsakal!",
    category: "Traditional",
    language: "English",
    label: "Traditional English",
  },
  {
    id: "trad-2",
    message: "Thiruvona Aashamsakal! Mahabali Chakravarthiyude bharanakalam orttu, samathwavum sahodaryavum pulathi, ee thiruvonam nammude hrudayangalil santhosham nirakkatte. Pookkalavum poovaaliyum niranja onam aashamsikunnu!",
    category: "Traditional",
    language: "Manglish",
    label: "Traditional Manglish",
  },
  {
    id: "biz-1",
    message: "Happy Onam from our family to yours! We are grateful for your continued partnership and trust. May this festive season bring mutual growth, new opportunities, and lasting prosperity. Onam Aashamsakal!",
    category: "Business",
    language: "English",
    label: "Business Client",
  },
  {
    id: "sm-1",
    message: "HAPPY ONAM 2026\n\nLet the Pookalam bloom\nLet the Sadya overflow\nLet the joy overflow\n\nMay Mahabali's legacy of love\nlight up your world\n\nOnam Aashamsakal!",
    category: "Social Media",
    language: "English",
    label: "Instagram Post",
  },
  {
    id: "sm-2",
    message: "Onam Varaayi!\n\nPookkalam, Sadya, Mundu, Celebration!\nEllarkkum oru nalla onam vannottae!\nHappy Onam machaane!",
    category: "Social Media",
    language: "Manglish",
    label: "Manglish Social Post",
  },
  {
    id: "short-1",
    message: "Happy Onam! Wishing you joy, peace, and a table full of delicious sadhya. Onashamsakal!",
    category: "Short Wishes",
    language: "English",
    label: "Quick English",
  },
  {
    id: "short-2",
    message: "Happy Onam machane! Sadya ready aano? Onam aashamsakal!",
    category: "Short Wishes",
    language: "Manglish",
    label: "Quick Manglish",
  },
  {
    id: "inspire-1",
    message: "Onam reminds us that good always triumphs, that harmony prevails, and that every season brings new hope. May you carry the spirit of Mahabali's golden era in your heart this Thiruvonam. Be kind. Be grateful. Be joyful. Happy Onam!",
    category: "Traditional",
    language: "English",
    label: "Inspirational Wish",
  },
  {
    id: "community-1",
    message: "Happy Onam to our wonderful community! May this harvest festival strengthen our bonds, inspire cooperation, and fill every home with abundance and joy. Let us celebrate together in the true spirit of Onam. Onam Aashamsakal!",
    category: "Professional",
    language: "English",
    label: "Community Wish",
  },
];

export const TEMPLATE_CATEGORIES = [
  "All",
  "Family",
  "Friends",
  "Professional",
  "Romantic",
  "Funny",
  "Traditional",
  "Business",
  "Social Media",
  "Short Wishes",
] as const;

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];
