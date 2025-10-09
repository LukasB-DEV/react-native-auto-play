//
//  TemplateStore.swift
//  Pods
//
//  Created by Manuel Auer on 03.10.25.
//
import CarPlay

class TemplateStore {
    private var store: [String: Template] = [:]

    func getCPTemplate(templateId key: String) -> CPTemplate? {
        return store[key]?.template
    }
    
    func getTemplate(templateId: String) -> Template? {
        return store[templateId]
    }

    func addTemplate(template: Template, templateId: String) {
        store[templateId] = template
    }

    func removeTemplate(templateId: String) {
        store.removeValue(forKey: templateId)
    }
}
