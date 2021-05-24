declare type ChatMessageType = typeof CONST.CHAT_MESSAGE_TYPES[keyof typeof CONST.CHAT_MESSAGE_TYPES];

declare module foundry {
    module data {
        interface ChatMessageSource {
            _id: string;
            user: string;
            timestamp: string;
            flavor?: string;
            content: string;
            speaker: ChatSpeakerSource;
            whisper: string[];
            blind: boolean;
            roll: object;
            sound: AudioPath;
            emote?: boolean;
            flags: Record<string, unknown>;
        }

        class ChatMessageData<
            TDocument extends documents.BaseChatMessage = documents.BaseChatMessage
        > extends abstract.DocumentData<TDocument> {
            /** @override */
            static defineSchema(): abstract.DocumentSchema;
        }
        interface ChatMessageData extends Omit<ChatMessageSource, '_id'> {
            readonly _source: ChatMessageSource;
        }
    }
}
