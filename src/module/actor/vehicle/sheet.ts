import { ActorSheetPF2e } from "../sheet/base";
import { VehiclePF2e } from "@actor/vehicle";
import { ItemDataPF2e } from "@item/data";
import { getActionIcon } from "@util";
import { ActorSheetDataPF2e } from "@actor/sheet/data-types";

export class VehicleSheetPF2e extends ActorSheetPF2e<VehiclePF2e> {
    static override get defaultOptions(): ActorSheetOptions {
        const options = super.defaultOptions;
        return {
            ...options,
            classes: [...options.classes, "vehicle"],
            width: 670,
            height: 480,
            tabs: [{ navSelector: ".sheet-navigation", contentSelector: ".sheet-content", initial: "details" }],
            template: "systems/pf2e/templates/actors/vehicle/sheet.hbs",
        };
    }

    override async getData(): Promise<VehicleSheetData> {
        const sheetData = await super.getData();

        return {
            ...sheetData,
            actorSizes: CONFIG.PF2E.actorSizes,
            actorSize: CONFIG.PF2E.actorSizes[this.actor.size],
            actorRarities: CONFIG.PF2E.rarityTraits,
            actorRarity: CONFIG.PF2E.rarityTraits[this.actor.system.traits.rarity],
            ac: getAdjustment(this.actor.attributes.ac.value, this.actor._source.system.attributes.ac.value),
            saves: {
                fortitude: getAdjustment(
                    this.actor.saves.fortitude.mod,
                    this.actor._source.system.saves.fortitude.value
                ),
            },
        };
    }

    override async prepareItems(sheetData: VehicleSheetData): Promise<void> {
        const actorData = sheetData.actor;

        // Actions
        const actions: Record<"action" | "reaction" | "free", { label: string; actions: ItemDataPF2e[] }> = {
            action: { label: game.i18n.localize("PF2E.ActionsActionsHeader"), actions: [] },
            reaction: { label: game.i18n.localize("PF2E.ActionsReactionsHeader"), actions: [] },
            free: { label: game.i18n.localize("PF2E.ActionsFreeActionsHeader"), actions: [] },
        };

        for (const itemData of actorData.items) {
            const item = this.actor.items.get(itemData._id, { strict: true });
            if (item.isOfType("physical")) {
                const systemData = item.system;
                itemData.showEdit = sheetData.user.isGM || systemData.identification.status === "identified";
                itemData.isInvestable = false;
                itemData.isIdentified = systemData.identification.status === "identified";
                itemData.assetValue = item.assetValue;
                itemData.showEdit = true;
            }

            // Actions
            if (item.isOfType("action")) {
                itemData.img = getActionIcon(item.actionCost);
                const actionType = item.actionCost?.type ?? "free";
                actions[actionType].actions.push(itemData);
            }
        }

        actorData.actions = actions;
    }

    override activateListeners($html: JQuery): void {
        super.activateListeners($html);
        {
            // ensure correct tab name is displayed after actor update
            const title = $(".sheet-navigation .active").attr("title");
            if (title) {
                $html.find(".navigation-title").text(title);
            }
        }
        $html.find(".sheet-navigation").on("mouseover", ".item", (event) => {
            const title = event.currentTarget.title;
            if (title) {
                $(event.currentTarget).parents(".sheet-navigation").find(".navigation-title").text(title);
            }
        });
        $html.find(".sheet-navigation").on("mouseout", ".item", (event) => {
            const parent = $(event.currentTarget).parents(".sheet-navigation");
            const title = parent.find(".item.active").attr("title");
            if (title) {
                parent.find(".navigation-title").text(title);
            }
        });

        // get buttons
        $html.find(".crb-tag-selector").on("click", (event) => this.onTraitSelector(event));
    }
}

function getAdjustment(value: number, reference: number): AdjustedValue {
    const adjustmentClass = value > reference ? "adjusted-higher" : value < reference ? "adjusted-lower" : null;
    return { value, adjustmentClass };
}

interface AdjustedValue {
    value: number;
    adjustmentClass: "adjusted-higher" | "adjusted-lower" | null;
}

interface VehicleSheetData extends ActorSheetDataPF2e<VehiclePF2e> {
    actorRarities: typeof CONFIG.PF2E.rarityTraits;
    actorRarity: string;
    actorSizes: typeof CONFIG.PF2E.actorSizes;
    actorSize: string;
    ac: AdjustedValue;
    saves: { fortitude: AdjustedValue };
}
