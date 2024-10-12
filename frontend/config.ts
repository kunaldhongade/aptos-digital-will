import Placeholder1 from "@/assets/placeholders/bear-1.png";
import Placeholder2 from "@/assets/placeholders/bear-2.png";
import Placeholder3 from "@/assets/placeholders/bear-3.png";

export const config: Config = {
  // Removing one or all of these socials will remove them from the page
  socials: {
    twitter: "https://twitter.com/projecthandle",
    discord: "https://discord.com/projectdiscord",
    homepage: "https://projectwebsite.com",
  },

  defaultCollection: {
    name: "Legacy Vault Collection",
    description: "A unique collection of digital legacies, each representing a timeless story.",
    image: Placeholder1,
  },

  ourStory: {
    title: "Our Story",
    subTitle: "Revolutionizing Digital Legacies on Blockchain",
    description:
      "Our platform offers an innovative and secure way to manage and pass on your digital legacy. Join us in creating a transparent system for future generations.",
    discordLink: "https://discord.com/projectdiscord",
    images: [Placeholder1, Placeholder2, Placeholder3],
  },

  ourTeam: {
    title: "Our Team",
    members: [
      {
        name: "Alex",
        role: "Lead Developer",
        img: Placeholder1,
        socials: {
          twitter: "https://twitter.com/alexhandle",
        },
      },
      {
        name: "Jordan",
        role: "Marketing Lead",
        img: Placeholder2,
      },
      {
        name: "Taylor",
        role: "Community Lead",
        img: Placeholder3,
        socials: {
          twitter: "https://twitter.com/taylorhandle",
        },
      },
    ],
  },

  faqs: {
    title: "F.A.Q.",

    questions: [
      {
        title: "How does the Legacy Vault system work?",
        description:
          "Our system allows users to create and manage digital legacies. You can designate beneficiaries, and the platform ensures secure and transparent transfer upon validation.",
      },
      {
        title: "How do I create a digital legacy?",
        description: `To create a digital legacy, follow these steps:
        Navigate to the "Create Legacy" section in the app.
        Fill in the necessary details about your assets and beneficiaries.
        Submit the form.
        Your legacy will be securely stored in the system.`,
      },
      {
        title: "How do I manage my assets?",
        description:
          "To manage your digital assets, go to the 'Manage Assets' section in the app. You can add, update, or remove assets and assign beneficiaries to each asset.",
      },
      {
        title: "What happens to my digital assets when I pass away?",
        description: `Once validated, our system initiates the process of transferring your assets to the designated beneficiaries according to your legacy instructions.`,
      },
      {
        title: "How can I update my digital legacy?",
        description: `You can update your legacy anytime by visiting the "Update Legacy" section in the app. After making the changes, submit the updated legacy.`,
      },
      {
        title: "Is my legacy secure?",
        description: `Yes, we employ the latest security protocols to ensure that your digital legacy and assets remain safe. Only authorized personnel can access your information.`,
      },
    ],
  },

  nftBanner: [Placeholder1, Placeholder2, Placeholder3],
};

export interface Config {
  socials?: {
    twitter?: string;
    discord?: string;
    homepage?: string;
  };

  defaultCollection?: {
    name: string;
    description: string;
    image: string;
  };

  ourTeam?: {
    title: string;
    members: Array<ConfigTeamMember>;
  };

  ourStory?: {
    title: string;
    subTitle: string;
    description: string;
    discordLink: string;
    images?: Array<string>;
  };

  faqs?: {
    title: string;
    questions: Array<{
      title: string;
      description: string;
    }>;
  };

  nftBanner?: Array<string>;
}

export interface ConfigTeamMember {
  name: string;
  role: string;
  img: string;
  socials?: {
    twitter?: string;
    discord?: string;
  };
}
