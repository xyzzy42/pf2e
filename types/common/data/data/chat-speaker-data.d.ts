declare module foundry {
    module data {
        /**
         * The data schema for an embedded Chat Speaker object.
         * @extends DocumentData
         * @memberof data
         * @see ChatMessageData
         *
         * @param data Initial data used to construct the data object
         * @param [document] The document to which this data object belongs
         *
         * @property [scene] The _id of the Scene where this message was created
         * @property [actor] The _id of the Actor who generated this message
         * @property [token] The _id of the Token who generated this message
         * @property [alias] An overridden alias name used instead of the Actor or Token name
         */
        interface ChatSpeakerSource {
            scene?: string;
            actor?: string;
            token?: string;
            alias: string;
        }

        class ChatSpeakerData<
            TDocument extends documents.BaseChatMessage = documents.BaseChatMessage
        > extends abstract.DocumentData<TDocument> {
            /** @override */
            static defineSchema(): abstract.DocumentSchema;
        }

        interface ChatSpeakerData<TDocument extends documents.BaseChatMessage = documents.BaseChatMessage>
            extends Omit<ChatMessageSource, '_id'> {
            readonly _source: ChatMessageSource;
        }
    }
}
