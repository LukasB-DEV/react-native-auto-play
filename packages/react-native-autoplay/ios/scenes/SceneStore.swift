//
//  SceneStore.swift
//  Pods
//
//  Created by Manuel Auer on 01.10.25.
//

protocol AutoPlayScene {
    func setRootTemplate()
}

class SceneStore {
    private static var store: [String: AutoPlayScene] = [:]

    static func addScene(moduleName: String, scene: AutoPlayScene) {
        store[moduleName] = scene
    }

    static func removeScene(moduleName: String) {
        store.removeValue(forKey: moduleName)
    }

    static func getScene(moduleName: String) -> AutoPlayScene? {
        return store[moduleName]
    }
}
