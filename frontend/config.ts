import Placeholder1 from "@/assets/placeholders/bear-1.png";
import Placeholder2 from "@/assets/placeholders/bear-2.png";
import Placeholder3 from "@/assets/placeholders/bear-3.png";

export const config: Config = {
  // Removing one or all of these socials will remove them from the page
  socials: {
    twitter: "https://twitter.com/kunaldhongade",
    discord: "https://discord.com",
    homepage: "https://kunaldhongade.vercel.app",
  },

  defaultCollection: {
    name: "Digital Will Collection",
    description: "A unique collection of digital assets, each with its own story and legacy.",
    image: Placeholder1,
  },

  ourStory: {
    title: "Our Story",
    subTitle: "Innovative Digital Will Platform on Aptos",
    description:
      "Our platform offers a secure and transparent way to manage and transfer digital assets. Join our community to ensure your digital legacy is preserved!",
    discordLink: "https://discord.com",
    images: [Placeholder1, Placeholder2, Placeholder3],
  },

  ourTeam: {
    title: "Our Team",
    members: [
      {
        name: "Kunal",
        role: "Blockchain Developer",
        img: Placeholder1,
        socials: {
          twitter: "https://twitter.com/kunaldhongade",
        },
      },
      {
        name: "Soham",
        role: "Marketing Specialist",
        img: Placeholder2,
      },
      {
        name: "Amrita",
        role: "Community Manager",
        img: Placeholder3,
        socials: {
          twitter: "https://twitter.com",
        },
      },
    ],
  },

  faqs: {
    title: "F.A.Q.",

    questions: [
      {
        title: "How does the Digital Will system work?",
        description:
          "Our system allows users to create and manage digital wills. You can specify beneficiaries for your digital assets, and our platform ensures secure and transparent transfer upon verification.",
      },
      {
        title: "How do I create a digital will?",
        description: `To create a digital will, follow these steps:
        Navigate to the "Create Digital Will" section in the app.
        Fill in the required details about your digital assets and beneficiaries.
        Submit the form.
        Your digital will be securely stored in our system.`,
      },
      {
        title: "How do I manage my digital assets?",
        description:
          "To manage your digital assets, navigate to the 'Manage Assets' section in the app. You can add, update, or remove assets and specify beneficiaries for each asset.",
      },
      {
        title: "What happens to my digital assets after I pass away?",
        description: `Upon verification of your passing, our system will initiate the transfer of your digital assets to the specified beneficiaries as per your digital will.`,
      },
      {
        title: "How can I update my digital will?",
        description: `You can update your digital will at any time by navigating to the "Update Digital Will" section in the app. Make the necessary changes and submit the updated will.`,
      },
      {
        title: "Is my digital will secure?",
        description: `Yes, our platform uses advanced security measures to ensure that your digital will and assets are protected. Only authorized personnel can access your information.`,
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
