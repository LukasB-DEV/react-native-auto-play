//
//  Parser.swift
//  Pods
//
//  Created by Manuel Auer on 08.10.25.
//

import CarPlay
import UIKit

struct Actions {
    let leadingNavigationBarButtons: [CPBarButton]
    let trailingNavigationBarButtons: [CPBarButton]
    let backButton: CPBarButton?
}

class Parser {
    static func parseActions(actions: [NitroAction]?) -> Actions {
        var leadingNavigationBarButtons: [CPBarButton] = []
        var trailingNavigationBarButtons: [CPBarButton] = []
        var backButton: CPBarButton?

        if let actions = actions {
            actions.forEach { action in
                if action.type == .back {
                    backButton = CPBarButton(title: "") { _ in
                        action.onPress()
                    }
                    return
                }
                let button =
                    action.image != nil
                    ? CPBarButton(
                        image: SymbolFont.imageFromNitroImage(
                            image: action.image!
                        )!
                    ) { _ in action.onPress() }
                    : CPBarButton(title: action.title ?? "") { _ in
                        action.onPress()
                    }

                if action.alignment == .leading {
                    // for whatever reason CarPlay decieds to reverse the order to what we get from js side so we can not append here
                    leadingNavigationBarButtons.insert(button, at: 0)
                    return
                }

                // for whatever reason CarPlay decieds to reverse the order to what we get from js side so we can not append here
                trailingNavigationBarButtons.insert(button, at: 0)
            }
        }

        return Actions(
            leadingNavigationBarButtons: leadingNavigationBarButtons,
            trailingNavigationBarButtons: trailingNavigationBarButtons,
            backButton: backButton
        )
    }

    static func parseText(text: AutoText?) -> String? {
        guard let text else { return nil }

        var result = text.text

        if let distance = text.distance {
            result = result.replacingOccurrences(
                of: "{distance}",
                with: parseDistance(distance: distance)
            )
        }

        if let duration = text.duration {
            let formatter = DateComponentsFormatter()
            formatter.unitsStyle = .short
            formatter.allowedUnits = [.hour, .minute]
            formatter.zeroFormattingBehavior = .dropAll
            formatter.collapsesLargestUnit = false

            result = result.replacingOccurrences(
                of: "{duration}",
                with: formatter.string(from: duration)?.replacingOccurrences(
                    of: ",",
                    with: ""
                ) ?? ""
            )
        }

        return result
    }

    static func parseDistance(distance: Distance) -> String {
        let formatter = MeasurementFormatter()
        formatter.unitOptions = .providedUnit
        formatter.unitStyle = .medium
        formatter.numberFormatter.minimumFractionDigits = 0
        formatter.numberFormatter.roundingMode = .halfUp

        var unit: UnitLength

        switch distance.unit {
        case .meters:
            formatter.numberFormatter.maximumFractionDigits = 0
            unit = UnitLength.meters
        case .miles:
            formatter.numberFormatter.maximumFractionDigits = 1
            unit = UnitLength.miles
        case .yards:
            formatter.numberFormatter.maximumFractionDigits = 0
            unit = UnitLength.yards
        case .feet:
            formatter.numberFormatter.maximumFractionDigits = 0
            unit = UnitLength.feet
        case .kilometers:
            formatter.numberFormatter.maximumFractionDigits = 1
            unit = UnitLength.kilometers
        }

        let measurement = Measurement(value: distance.value, unit: unit)

        return formatter.string(from: measurement)
    }

    static func parseSections(
        sections: [NitroSection]?,
        updateSection: @escaping (NitroSection, Int) -> Void
    ) -> [CPListSection] {
        guard let sections else { return [] }

        return sections.enumerated().map { (sectionIndex, section) in
            let items = section.items.enumerated().map { (itemIndex, item) in
                let isSelected =
                    section.type == .radio
                    && Int(section.selectedIndex ?? -1) == itemIndex

                let toggleImage = item.checked.map { checked in
                    UIImage.makeToggleImage(
                        enabled: checked,
                        maximumImageSize: CPListItem.maximumImageSize
                    )
                }

                let listItem = CPListItem(
                    text: parseText(text: item.title),
                    detailText: parseText(text: item.detailedText),
                    image: SymbolFont.imageFromNitroImage(image: item.image),
                    accessoryImage: isSelected
                        ? UIImage.checkmark : toggleImage,
                    accessoryType: item.browsable == true
                        ? .disclosureIndicator : .none
                )

                listItem.isEnabled = item.enabled

                listItem.handler = { _item, completion in

                    var updatedSection = sections[sectionIndex]
                    if let checked = updatedSection.items[itemIndex].checked {
                        updatedSection.items[itemIndex].checked = !checked
                    }

                    if updatedSection.type == .radio {
                        updatedSection.selectedIndex = Double(itemIndex)
                    }

                    updateSection(updatedSection, sectionIndex)

                    item.onPress(item.checked.map { checked in !checked })
                    completion()
                }

                return listItem
            }

            return CPListSection(
                items: items,
                header: section.title,
                sectionIndexTitle: nil
            )
        }
    }
}
