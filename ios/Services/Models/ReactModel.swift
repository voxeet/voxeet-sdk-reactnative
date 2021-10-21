import Foundation

internal typealias ReactModelType = [String: Any]

internal protocol ReactModelMappable {

	func toReactModel() -> ReactModelType
}


internal protocol ReactModelValueMappable {

	associatedtype ReactModelValueType

	func toReactModelValue() -> ReactModelValueType
}

