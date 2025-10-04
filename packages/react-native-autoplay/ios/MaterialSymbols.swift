//
//  MaterialSymbols.swift
//  Pods
//
//  Created by Manuel Auer on 04.10.25.
//

import CoreText
import UIKit

class MaterialSymbols {
    private static var isRegistered = false

    static func registerMaterialSymbols() {
        let podBundle = Bundle(for: MaterialSymbols.self)

        guard
            let bundleURL = podBundle.url(
                forResource: "NitroAutoplay",
                withExtension: "bundle"
            ),
            let resourceBundle = Bundle(url: bundleURL),
            let fontURL = resourceBundle.url(
                forResource: "MaterialSymbolsOutlined-Regular",
                withExtension: "ttf"
            )
        else {
            print("❌ Could not find font in bundle")
            return
        }

        guard let fontData = try? Data(contentsOf: fontURL) as CFData,
            let provider = CGDataProvider(data: fontData),
            let font = CGFont(provider)
        else {
            return
        }

        var error: Unmanaged<CFError>?
        CTFontManagerRegisterGraphicsFont(font, &error)
        if let error = error?.takeUnretainedValue() {
            print("Failed to register font: \(error)")
        } else {
            print("Font \(font.fullName as String? ?? "unknown") registered")
        }

        MaterialSymbols.isRegistered = true
    }

    static func imageFromMaterialSymbol(
        glyph: Double,
        size: CGFloat,
        color: UIColor = .black
    ) -> UIImage? {
        if !MaterialSymbols.isRegistered {
            MaterialSymbols.registerMaterialSymbols()
        }

        let fontName = "Material Symbols Outlined"
        guard let font = UIFont(name: fontName, size: size) else {
            print("❌ Font not loaded")
            return nil
        }

        let attributes: [NSAttributedString.Key: Any] = [
            .font: font,
            .foregroundColor: color,
        ]

        let codepoint = String(UnicodeScalar(UInt32(glyph))!)
        let attrString = NSAttributedString(
            string: codepoint,
            attributes: attributes
        )
        let textSize = attrString.size()

        UIGraphicsBeginImageContextWithOptions(textSize, false, 0)
        attrString.draw(at: .zero)
        let image = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()

        return image
    }
}
