//
//  HybridMapTemplate.swift
//  Pods
//
//  Created by Manuel Auer on 15.10.25.
//

class HybridMapTemplate: HybridHybridMapTemplateSpec {
    func createMapTemplate(config: MapTemplateConfig) throws {
        let template = MapTemplate(config: config)
        try RootModule.withScene { scene in
            scene.templateStore.addTemplate(
                template: template,
                templateId: config.id
            )
        }
    }

    func setTemplateMapButtons(templateId: String, buttons: [NitroMapButton]?)
        throws
    {
        try RootModule.withTemplate(templateId: templateId) {
            template in
            guard let template = template as? MapTemplate else {
                return
            }

            template.config.mapButtons = buttons
            template.invalidate()
        }
    }

    func showNavigationAlert(templateId: String, alert: NitroNavigationAlert)
        throws
    {
        try RootModule.withMapTemplate(templateId: templateId) { template in
            template.showAlert(alertConfig: alert)
        }
    }

    func showTripSelector(
        templateId: String,
        trips: [TripConfig],
        selectedTripId: String?,
        textConfig: TripPreviewTextConfiguration,
        onTripSelected: @escaping (_ tripId: String, _ routeId: String) -> Void,
        onTripStarted: @escaping (_ tripId: String, _ routeId: String) -> Void
    ) throws {
        try RootModule.withMapTemplate(templateId: templateId) { template in
            try template.showTripSelector(
                trips: trips,
                selectedTripId: selectedTripId,
                textConfig: textConfig,
                onTripSelected: onTripSelected,
                onTripStarted: onTripStarted
            )
        }
    }

    func hideTripSelector(templateId: String) throws {
        try RootModule.withMapTemplate(templateId: templateId) { template in
            template.hideTripSelector()
        }
    }
    
    func updateGuidanceBackgroundColor(templateId: String, color: NitroColor?) throws {
        try RootModule.withMapTemplate(templateId: templateId) { template in
            template.updateGuidanceBackgroundColor(color: color)
        }
    }
}
